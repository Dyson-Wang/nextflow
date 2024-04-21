/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    async rewrites() { 
        return [ 
          { source: '/api', destination: `http://172.30.201.10/` }, 
        ]
      },
};

export default nextConfig;
