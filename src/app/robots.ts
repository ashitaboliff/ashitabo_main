import { MetadataRoute } from 'next'
const URL = process.env.AUTH_URL

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: '/admin/',
		},
		sitemap: `${URL}/sitemap.xml`,
	}
}
