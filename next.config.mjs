/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ['next-mdx-remote'],
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'profile.line-scdn.net',
			},
			{
				protocol: 'https',
				hostname: 'raw.githubusercontent.com'
			}
		],
	},
}

export default nextConfig
