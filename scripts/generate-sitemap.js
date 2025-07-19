const fs = require('fs');
const path = require('path');

// 오늘 날짜를 ISO 8601 형식으로 가져오기
const today = new Date().toISOString().split('T')[0];

// sitemap.xml 내용 생성
const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    <url>
        <loc>https://mind-age-test.vercel.app/</loc>
        <lastmod>${today}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
        <xhtml:link rel="alternate" hreflang="ko" href="https://mind-age-test.vercel.app/"/>
        <xhtml:link rel="alternate" hreflang="x-default" href="https://mind-age-test.vercel.app/"/>
        <image:image>
            <image:loc>https://mind-age-test.vercel.app/og-image.png</image:loc>
            <image:title>정신연령 테스트</image:title>
            <image:caption>10초만에 알아보는 정신연령 테스트 - 매일 새로운 질문으로 당신의 진짜 나이를 측정해보세요</image:caption>
        </image:image>
    </url>
</urlset>`;

// sitemap.xml 파일 생성
const sitemapPath = path.join(__dirname, '..', 'sitemap.xml');
fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');

console.log(`Sitemap generated successfully with date: ${today}`);