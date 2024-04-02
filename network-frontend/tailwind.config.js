/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "./src/components/**/*.{js,jsx}"],
  theme: {
    extend: {
      animation : {
        'alert-downwards' : 'alert 3s forwards',
        'alert-upwards' : 'alert 3s backwards',
        'fade-out' : 'fade-out 5s forwards',
        'grow' : 'grow 0.250s forwards',
        'shrink' : 'shrink 0.250s forwards',
        'expand' : 'expand 1.5s infinite',
        'image-grow' : 'image-grow 0.250s forwards',
        'element-shrink' : 'element-shrink 0.250s forwards',
      },
      keyframes : {
        'alert' : {
          '0%' : { transform : 'translateY(0px)', opacity : 0},
          '15%' : {transform : 'translateY(50px)', opacity: 1},
          '85%' : {transform : 'translateY(50px)', opacity: 1},
          '95%' : {opacity : 0.5},
          '100%' : {transform : 'translateY(0px)', opacity:0}
        },
        'fade-out' : {
          '0%' : { opacity : 1},
          '100%' : {opacity : 0}
        },
        'grow' : {
          '0%' : { transform : 'scale(0.95)', opacity : 0},
          '100%' : { transform : 'scale(1)', opacity : 1}
        },
        'shrink' : {
          '0%' : { transform : 'scale(1)', opacity: 1},
          '100%' : { transform : 'scale(0.95)', opacity: 0}
        },
        'expand' : {
          '0%' : {transform : 'scale(0.95)'},
          '50%' : {transform : 'scale(1.05)'},
          '100%' : {transform : 'scale(0.95)'}
          
        },
        'image-grow' : {
          '0%' : {transform : 'scale(0.75)', opacity : 0},
          '100%' : {transform : 'scale(1)', opacity: 1}
        },
        'element-shrink' :{
          '0%' : {transform : 'scale(1)', opacity : 0.95},
          '100%' : {transform : 'scale(0.75)', opacity: 0}
        },
      },
      screens : {
        'mobile' : '431px',
        'fold': '281px'
      },
      colors: {
    
        // Font colors
        'light-gray-hover' : '#E7E7E8',
        'twitter-dark' : '#14171A',
        'twitter-dark-gray' : '#657786',
        'twitter-light-gray' : '#AAB8C2',
        'light-gray' : '#EFF3F4',
        'icon-gray' : '#536471',
        'post-gray' : '#677682',
        'info-gray' : '#536471',
        
        // Main action button colors
        'twitter-blue' : '#1D9BF0',
        'twitter-yellow' : '#FCD500',
        'twitter-pink' : '#F6187F',
        'twitter-purple' : '#7557FF',
        'twitter-orange' : '#FC7A00',
        'twitter-green' : '#00B978' ,

        // Light mode palette
        'light-highlight' : '#F7F7F7',
        'light-sidebar-highlight' : '#E7E7E8',
        'light-separator' : '#EFF3F4',
        
        // Dim mode palette
        'dim' : '#14202B',
        'dim-post-highlight' : '#1C2732',
        'dim-sidebar-highlight' : '#2C3640',
        'dim-separator' : '#38444D',
        'subdim' : '#1E2732',

        // Dark mode palette
        'dark-highlight' : '#080808',
        'dark-sidebar-highlight' : '#181818',
        'dark-separator' : '#2F3235',

        // Login palette ( for some specific UI elements)
        'login-dark-highlight' : '#031018',
        'login-highlight' : '#181919',
        'login-modal' : '#435461',
        'login-dark-border' : '#536471',
        'login-gray' : '#333639',
        'login-light-gray' : '#71767B',
        'input-gray' : '#686D72',
        'disabled-input' : '#101214',
        'error-red' : '#F4212E'
      },
      boxShadow : {
        'custom' : '0px 0px 2px 1px rgba(255, 255, 255, 0.5)'
      },
      fontFamily : {
        'twitter' : 'TwitterChirpExtendedHeavy","Verdana",-apple-system'
      }
    },

  },
  variants : {
    extend : {
      backgroundColor : ['hover']
    }
  },
  plugins: [],
}

