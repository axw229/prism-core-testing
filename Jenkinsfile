pipeline {
  options {
    buildDiscarder(
      logRotator(
        numToKeepStr: '5',
        artifactNumToKeepStr: '5'
      )
    )
  }
  agent any
  environment {
    IMAGE_NAME = "prism-core"
  }
  stages {
    stage('builder') {
      when {
        branch 'develop'
      }
      steps {
        sh """
        #!/bin/bash

        # Build the builder image
        docker build --no-cache --pull -t ${IMAGE_NAME}-build -f Dockerfile.build .
        """

        sh """
        #!/bin/bash

        # Clean up any old image archive files
        rm -rf dist

        # Mount the volumes from Jenkins and run the deploy
        docker run \
          --name ${IMAGE_NAME}-build-${BUILD_NUMBER} \
          ${IMAGE_NAME}-build:latest

        docker cp ${IMAGE_NAME}-build-${BUILD_NUMBER}:/app/dist.tgz ./
        tar zxf dist.tgz
        rm dist.tgz

        # Remove the build container
        docker rm -f ${IMAGE_NAME}-build-${BUILD_NUMBER}
        """
        stash includes: 'dist/**/*', name: 'static'
      }
    }
    stage('build') {
      when {
        branch 'develop'
      }
      steps {
        unstash 'static'
        sh """
        # Clean up any old image archive files
        rm -rf ${IMAGE_NAME}.docker.tar.gz
        docker build --pull \
          -t ${IMAGE_NAME}:${BUILD_NUMBER} \
          --label "jenkins.build=${BUILD_NUMBER}" \
          --label "jenkins.job_url=${JOB_URL}" \
          --label "jenkins.build_url=${JOB_URL}${BUILD_NUMBER}/" \
          --label "git.commit=${GIT_COMMIT}" \
          --label "git.repo=${GIT_URL}" \
          .
        docker save -o ${IMAGE_NAME}.docker.tar ${IMAGE_NAME}:${BUILD_NUMBER}
        gzip ${IMAGE_NAME}.docker.tar
        """

        sh """
        # This is to allow creating an archive for Veracode
        docker run \
          --name ${IMAGE_NAME}_artifact_${BUILD_NUMBER} \
          --entrypoint /bin/sh \
          -w /usr/share/nginx \
          ${IMAGE_NAME}:${BUILD_NUMBER} \
          -c 'tar zcf /tmp/prism-core.tgz html'

        docker cp ${IMAGE_NAME}_artifact_${BUILD_NUMBER}:/tmp/prism-core.tgz ./

        # Remove the artifact container
        docker rm -f ${IMAGE_NAME}_artifact_${BUILD_NUMBER}
        """

        archiveArtifacts artifacts: "${IMAGE_NAME}.docker.tar.gz", fingerprint: true
        archiveArtifacts artifacts: "prism-core.tgz", fingerprint: true
      }
    }
    stage('image-testing') {
      when {
        branch 'develop'
      }
      agent {
        docker {
          image 'docker.cpartdc01.sherwin.com/ecomm/utils/docker_rspec'
          args '-u root'
          reuseNode true
        }
      }
      steps {
        sh """
        cp ci/Gemfile ./
        bundle install
        bundle exec rspec
        """
      }
    }
    stage('publish') {
      when {
        expression { BRANCH_NAME ==~ /^(develop|hotfix|qa|release)$/ }
      }
      steps {
        withDockerRegistry([credentialsId: 'artifactory_credentials', url: 'https://docker.cpartdc01.sherwin.com/v2']) {
          sh """
          if [ "${BRANCH_NAME}" = "develop" ]; then
            docker tag ${IMAGE_NAME}:${BUILD_NUMBER} docker.cpartdc01.sherwin.com/ecomm/apps/${IMAGE_NAME}:${BRANCH_NAME}
          elif [ "${BRANCH_NAME}" = "hotfix" ]; then
            docker tag ${IMAGE_NAME}:${BUILD_NUMBER} docker.cpartdc01.sherwin.com/ecomm/apps/${IMAGE_NAME}:${BRANCH_NAME}
          elif [ "${BRANCH_NAME}" = "qa" ]; then
            docker pull docker.cpartdc01.sherwin.com/ecomm/apps/${IMAGE_NAME}:develop
            docker tag docker.cpartdc01.sherwin.com/ecomm/apps/${IMAGE_NAME}:develop docker.cpartdc01.sherwin.com/ecomm/apps/${IMAGE_NAME}:${BRANCH_NAME}
          elif [ "${BRANCH_NAME}" = "release" ]; then
            docker pull docker.cpartdc01.sherwin.com/ecomm/apps/${IMAGE_NAME}:qa
            docker tag docker.cpartdc01.sherwin.com/ecomm/apps/${IMAGE_NAME}:qa docker.cpartdc01.sherwin.com/ecomm/apps/${IMAGE_NAME}:${BRANCH_NAME}
          fi
          """
          sh "docker push docker.cpartdc01.sherwin.com/ecomm/apps/${IMAGE_NAME}:${BRANCH_NAME}"
        }
      }
    }
    stage('publish latest') {
      when {
        branch 'release'
      }
      steps {
        withDockerRegistry([credentialsId: 'artifactory_credentials', url: 'https://docker.cpartdc01.sherwin.com/v2']) {
          sh "docker tag docker.cpartdc01.sherwin.com/ecomm/apps/${IMAGE_NAME}:${BRANCH_NAME} docker.cpartdc01.sherwin.com/ecomm/apps/${IMAGE_NAME}:latest"
          sh "docker push docker.cpartdc01.sherwin.com/ecomm/apps/${IMAGE_NAME}:latest"
        }
      }
    }
    stage('security') {
      when {
        branch 'develop'
      }
      steps {
        build job: '/DevOps/Security/Veracode-Scanner',
              parameters: [
                string(name: 'APP_NAME', value: "${IMAGE_NAME}"),
                string(name: 'APP', value: 'prism-core.tgz'),
                string(name: 'BUILD_JOB', value: "${JOB_NAME}"),
                string(name: 'BUILD_VERSION', value: "${GIT_COMMIT}"),
                string(name: 'BUILD_JOB_NUMBER', value: "${BUILD_NUMBER}")
              ],
              wait: false
      }
    }
    stage('Dev deploy') {
      environment {
        VPC = "ebus"
        RANCHER_ENV = "nonprod"
        RANCHER_PROJ = "1a33"
        RANCHER_STACK = "prism-web-dev"
        IMAGE_TAG="${BRANCH_NAME}"
        API_URL = "https://dev-prism-api.ebus.swaws"
        WEB_URL = "https://dev-prism-web.ebus.swaws"
      }
      when {
        branch 'develop'
      }
      steps {
        withCredentials([usernamePassword(credentialsId: 'ebus-nonprod-rancher', usernameVariable: 'RANCHER_ACCESS_KEY', passwordVariable: 'RANCHER_SECRET_KEY')]) {
         sh """
         #!/bin/bash -x
         cd ci
         # Use Rancher to Deploy the stack
         rancher \
           --url "http://rancher.${VPC}.swaws/v2-beta/projects/${RANCHER_PROJ}" \
           --environment ${RANCHER_ENV} \
           --access-key "${RANCHER_ACCESS_KEY}" \
           --secret-key "${RANCHER_SECRET_KEY}" \
           up \
             -d \
             -u --force-upgrade \
             -f docker-compose.yml \
             --batch-size 1 \
             --stack ${RANCHER_STACK}

         # Wait or the upgrade to complete
         RANCHER_PROJ=${RANCHER_PROJ} \
         wait_for_rancher ${RANCHER_STACK}

         # Use Rancher to Deploy the stack
         rancher \
           --url "http://rancher.${VPC}.swaws/v2-beta/projects/${RANCHER_PROJ}" \
           --environment ${RANCHER_ENV} \
           --access-key "${RANCHER_ACCESS_KEY}" \
           --secret-key "${RANCHER_SECRET_KEY}" \
           up \
             -d \
             -f docker-compose.yml \
             --batch-size 1 \
             --confirm-upgrade \
             --stack ${RANCHER_STACK}
         """
        }
      }
    }

    stage('QA deploy') {
      environment {
        VPC = "ebus"
        RANCHER_ENV = "nonprod"
        RANCHER_PROJ = "1a33"
        RANCHER_STACK = "prism-web-qa"
        IMAGE_TAG="${BRANCH_NAME}"
        API_URL = "https://qa-prism-api.ebus.swaws"
        WEB_URL = "https://qa-prism-web.ebus.swaws"
      }
      when {
        branch 'qa'
      }
      steps {
        withCredentials([usernamePassword(credentialsId: 'ebus-nonprod-rancher', usernameVariable: 'RANCHER_ACCESS_KEY', passwordVariable: 'RANCHER_SECRET_KEY')]) {
         sh """
         #!/bin/bash -x
         cd ci
         # Use Rancher to Deploy the stack
         rancher \
           --url "http://rancher.${VPC}.swaws/v2-beta/projects/${RANCHER_PROJ}" \
           --environment ${RANCHER_ENV} \
           --access-key "${RANCHER_ACCESS_KEY}" \
           --secret-key "${RANCHER_SECRET_KEY}" \
           up \
             -d \
             -u --force-upgrade \
             -f docker-compose.yml \
             --batch-size 1 \
             --stack ${RANCHER_STACK}

         # Wait or the upgrade to complete
         RANCHER_PROJ=${RANCHER_PROJ} \
         wait_for_rancher ${RANCHER_STACK}

         # Use Rancher to Deploy the stack
         rancher \
           --url "http://rancher.${VPC}.swaws/v2-beta/projects/${RANCHER_PROJ}" \
           --environment ${RANCHER_ENV} \
           --access-key "${RANCHER_ACCESS_KEY}" \
           --secret-key "${RANCHER_SECRET_KEY}" \
           up \
             -d \
             -f docker-compose.yml \
             --batch-size 1 \
             --confirm-upgrade \
             --stack ${RANCHER_STACK}
         """
        }
      }
    }

    stage('Prod deploy') {
      environment {
        VPC = "ebus"
        IMAGE_TAG="${BRANCH_NAME}"
        RANCHER_ENV = "prod"
        RANCHER_PROJ = "1a199"
        RANCHER_STACK = "prism-web-prod"
        API_URL = "https://prism-api.sherwin-williams.com"
        WEB_URL = "https://prism.sherwin-williams.com"
        ELB_NAME= "prism-she-SimpleEL-QG3H7DKM2U0P"
      }
      when {
        branch 'release'
      }
      steps {
        withCredentials([usernamePassword(credentialsId: 'ebus-prod-rancher', usernameVariable: 'RANCHER_ACCESS_KEY', passwordVariable: 'RANCHER_SECRET_KEY')]) {
          sh """
          #!/bin/bash -x
          cd ci
          # Use Rancher to Deploy the stack
          rancher \
            --url "http://rancher.${VPC}.swaws/v2-beta/projects/${RANCHER_PROJ}" \
            --environment ${RANCHER_ENV} \
            --access-key "${RANCHER_ACCESS_KEY}" \
            --secret-key "${RANCHER_SECRET_KEY}" \
            up \
              -d \
              -u --force-upgrade \
              -f docker-compose.yml \
              -f docker-compose-prod.yml \
              --batch-size 1 \
              --rancher-file rancher-compose-prod.yml \
              --stack ${RANCHER_STACK}

          # Wait or the upgrade to complete
          RANCHER_PROJ=${RANCHER_PROJ} \
          wait_for_rancher ${RANCHER_STACK}

          # Use Rancher to Deploy the stack
          rancher \
            --url "http://rancher.${VPC}.swaws/v2-beta/projects/${RANCHER_PROJ}" \
            --environment ${RANCHER_ENV} \
            --access-key "${RANCHER_ACCESS_KEY}" \
            --secret-key "${RANCHER_SECRET_KEY}" \
            up \
              -d \
              -f docker-compose.yml \
              --batch-size 1 \
              --rancher-file rancher-compose-prod.yml \
              --confirm-upgrade \
              --stack ${RANCHER_STACK}
          """
        }
      }
    }

  }
  post {
    always {
      script {
        currentBuild.result = currentBuild.result ?: 'SUCCESS'

        emailext (
          to: 'brendan.do@sherwin.com,cody.richmond@sherwin.com,prwilliams@sherwin.com,brandon.chartier@sherwin.com,cc:jonathan.l.gnagy@sherwin.com',
          subject: "${env.JOB_NAME} #${env.BUILD_NUMBER} [${currentBuild.result}]",
          body: "Build URL: ${env.BUILD_URL}.\n\n",
          attachLog: true,
        )

        sparkSend(
          credentialsId: 'jenkins-webex-bot',
          message: "**BUILD ${currentBuild.result}**: $JOB_NAME [build ${BUILD_NUMBER}](${JOB_URL}${BUILD_NUMBER}/)",
          messageType: 'markdown',
          spaceList: [[
            spaceId: '148571b0-7585-11e8-9a3a-a75b99388ff0',
            spaceName: 'JenkinsNotifications'
          ]]
        )
      }
    }
  }
}
