/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "./src/components/**/*.{js,jsx}"],
  theme: {
    extend: {
      animation : {
        'fade-out' : 'fade-out 5s forwards',
        'grow' : 'grow 0.250s forwards',
        'shrink' : 'shrink 0.250s forwards',
        'expand' : 'expand 1.5s infinite'
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
          
        }
      },
      screens : {
        'mobile' : '431px'
      },
      colors: {
        'dark-purple': '#081A51',
        'light-white': 'rgba(255, 255, 255, 0.18)',
        'gray' :
        {
          900 : '#1B1C1E',
          800 : '#2f3136',
          700 : '#36393f',
          600 : '#4f545c',
          400 : '#d4d7dc',
          300 : '#e3e5e8',
          200 : '#ebedef',
          100 : '#f2f3f5',
        },
        'light-gray-hover' : '#E7E7E8',
        'twitter-dark' : '#14171A',
        'twitter-blue' : '#1D9BF0',
        'twitter-dark-gray' : '#657786',
        'twitter-light-gray' : '#AAB8C2',
        'light-gray' : '#EFF3F4',
        'icon-gray' : '#536471',
        'post-gray' : '#677682',
        'info-gray' : '#536471',
        'login-modal' : '#435461'
        
      },
      boxShadow : {
        'custom' : '0px 0px 10px 4px rgba(255, 255, 255, 0.5)'
      },
      fontFamily : {
        'twitter' : 'TwitterChirpExtendedHeavy","Verdana",-apple-system'
      }
    },
  },
  plugins: [],
}

