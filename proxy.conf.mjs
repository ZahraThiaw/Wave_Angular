export default [
    {
        context: ['/api'],
        target: 'http://localhost:3005',
        secure: false,
        pathRewrite: {
            '^/api': ''
        },
        changeOrigin: true
    }
];