/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "./src/components/**/*.{js,jsx}"],
  theme: {
    extend: {
      animation : {
        'fade-out' : 'fade-out 5s forwards',
        'grow' : 'grow 0.250s forwards',
        'shrink' : 'shrink 0.250s forwards',
        'expand' : 'expand 1.5s infinite',
        'image-grow' : 'image-grow 0.250s forwards',
        'element-shrink' : 'element-shrink 0.250s forwards',
      },
      keyframes : {
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
        'mobile' : '431px'
      },
      colors: {
        'dark-purple': '#081A51',
        'light-white': 'rgba(255, 255, 255, 0.18)',
     
        'light-gray-hover' : '#E7E7E8',
        'twitter-dark' : '#14171A',
        'twitter-blue' : '#1D9BF0',
        'twitter-dark-gray' : '#657786',
        'twitter-light-gray' : '#AAB8C2',
        'light-gray' : '#EFF3F4',
        'icon-gray' : '#536471',
        'post-gray' : '#677682',
        'info-gray' : '#536471',
        'login-modal' : '#435461',
        'twitter-yellow' : '#FCD500',
        'twitter-pink' : '#F6187F',
        'twitter-purple' : '#7557FF',
        'twitter-orange' : '#FC7A00',
        'twitter-green' : '#00B978' ,

        'light-highlight' : '#F7F7F7',
        'light-sidebar-highlight' : '#E7E7E8',
        'light-separator' : '#EFF3F4',
        
        'dim' : '#14202B',
        'dim-post-highlight' : '#1C2732',
        'dim-sidebar-highlight' : '#2C3640',
        'dim-separator' : '#38444D',
        'subdim' : '#1E2732',

        'dark-highlight' : '#080808',
        'dark-sidebar-highlight' : '#181818',
        'dark-separator' : '#2F3235'  
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

