/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.filestackcontent.com',
                pathname: '/**'
            }
        ]
    }
};

export default nextConfig;
