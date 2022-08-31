module.exports = {
  content: ['./src/**/*.tsx', './src/**/*.ts'],
  variants: {
    extend: {
      backgroundColor: ['checked'],
      backgroundPosition: ['hover'],
      borderColor: ['checked'],
      ringWidth: ['focus-visible'],
      textDecoration: ['focus-visible']
    }
  },
  theme: {
    fontFamily: {
      sans: "var(--prism-typography-body-font-family, 'Open Sans', sans-serif)"
    },
    extend: {
      animation: {
        fadeIn: 'fadeIn 0.2s ease-in-out',
        'fadeIn-1': 'fadeIn 1s ease-in-out',
        delayedFadeIn: 'delayedFadeIn .2s ease-in-out'
      },
      backgroundPosition: {
        'bottom-0': '0 -100%',
        'bottom-20': '0 -80%'
      },
      borderWidth: {
        1: '1px',
        3: '3px',
        5: '5px',
        6: '6px'
      },
      boxShadow: {
        swatch: 'inset 0 0 0 1px white,0 0 2px 0 rgba(0,0,0,0.25)'
      },
      colors: {
        primary: 'var(--prism-theme-color-primary, #0069af)',
        secondary: 'var(--prism-theme-color-secondary, #2CABE2)',
        primaryBg: 'var(--prism-theme-color-primary-bg, #fafafa)',
        black: 'var(--prism-theme-color-black, #000)',
        buttonColor: 'var(--prism-theme-button-color, #0069af)',
        buttonBgColor: 'var(--prism-theme-button-bg-color, #FFF)',
        buttonHoverColor: 'var(--prism-theme-button-hover-color, #0069af)',
        buttonHoverBgColor: 'var(--prism-theme-button-hover-bg-color, #F2F2F2)',
        buttonActiveColor: 'var(--prism-theme-button-active-color, #FFF)',
        buttonActiveBgColor: 'var(--prism-theme-button-active-bg-color, #0069af)',
        danger: 'var(--prism-theme-color-danger, #E94b35)',
        error: 'var(--prism-theme-color-error, #e94b35)',
        grey: 'var(--prism-theme-color-grey, #cccccc)',
        'light-grey': 'var(--prism-theme-color-light-grey, #dddddd)',
        lightest: 'var(--prism-theme-color-light-lightest, #fafafa)',
        'near-black': 'var(--prism-theme-color-near-black, #2e2e2e)',
        success: 'var(--prism-theme-color-success, #1fce6d)',
        warning: 'var(--prism-theme-color-warning, #f2c500)',
        white: 'var(--prism-theme-color-white, #FFF)',
        light: '#DDD',
        dark: '#2E2E2E'
      },
      fontFamily: {
        title: 'var(--prism-typography-title-font-style)'
      },
      fontSize: {
        '2xs': ['10px', '12px'],
        '1.5xs': ['.8125rem', '1.3125rem'],
        '2.5xl': ['1.7rem', '2.2rem']
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'scale(0.9)' },
          '100%': { opacity: 1, transform: 'scale(1)' }
        },
        delayedFadeIn: {
          '0%': { opacity: 0 },
          '25%': { opacity: 0 },
          '100%': { opacity: 1 }
        }
      },
      margin: {
        4.5: '1.125rem',
        'em-0.5': '0.5em',
        'em-1': '1em'
      },
      padding: {
        '2/4': '50%',
        '3/4': '75%'
      },
      screens: {
        xs: '475px'
      },
      transitionProperty: {
        'background-position': 'background-position',
        width: 'width'
      },
      width: {
        '1/10': '10%'
      }
    }
  }
}
