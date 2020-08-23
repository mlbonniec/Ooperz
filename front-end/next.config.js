require('dotenv').config();
const withStyles = require('@webdeb/next-styles');

module.exports = withStyles({
    distDir: 'build',
    poweredByHeader: false,
    
    experimental: {
        publicDirectory: true
    },

    ignoreOrder: true,
    sass: true, // use .scss files
    modules: true, // style.(m|module).css & style.(m|module).scss for module files
    sassLoaderOptions: {
        sassOptions: {
            includePaths: ["src/styles"], // @import 'variables'; # loads (src/styles/variables.scss), you got it..
        }
    },
    webpack: (config, {webpack}) => {
        config.plugins.push(new webpack.EnvironmentPlugin(process.env))
        
        return config;
    }
});