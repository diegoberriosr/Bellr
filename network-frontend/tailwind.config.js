/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "./src/components/**/*.{js,jsx}"],
  theme: {
    extend: {
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

