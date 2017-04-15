const webpack = {
    dev: {
        devtool: 'inline-source-map',
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    loader: `babel`
                }
            ],
            resolve: {
                extensions: ['.js']
            }
        },
        output: {
            filename: 'index.js'
        }
    },
    prod: {
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    loader: `babel`
                }
            ],
            resolve: {
                extensions: ['.js']
            }
        },
        output: {
            filename: 'index.js'
        }
    }
};

export default {
    path: {
        src: 'src',
        dist: 'dist'
    },
    webpack: webpack.dev,
    webpackDist: webpack.prod,
    minify: {
        ext: {
            min: '.min.js'
        }
    }
};
