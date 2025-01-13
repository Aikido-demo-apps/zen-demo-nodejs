import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface UserAgent {
  pattern: string;
  category: number;
}

@Injectable()
export class UserMockMiddleware implements NestMiddleware {

  private readonly USER_AGENTS: UserAgent[] = [
    // AI Data Scrapers (category 1)
    { pattern: 'AI2Bot', category: 1 },
    { pattern: 'Applebot-Extended', category: 1 },
    { pattern: 'Bytespider', category: 1 },
    { pattern: 'CCBot', category: 1 },
    { pattern: 'ClaudeBot', category: 1 },
    { pattern: 'cohere-training-data-crawler', category: 1 },
    { pattern: 'Diffbot', category: 1 },
    { pattern: 'Google-Extended', category: 1 },
    { pattern: 'GPTBot', category: 1 },
    { pattern: 'Kangaroo Bot', category: 1 },
    { pattern: 'meta-externalagent', category: 1 },
    { pattern: 'anthropic-ai', category: 1 },

    // Archivers (category 2)
    { pattern: 'archive.org_bot', category: 2 },
    { pattern: 'Arquivo-web-crawler', category: 2 },
    { pattern: 'heritrix', category: 2 },
    { pattern: 'ia_archiver', category: 2 },
    { pattern: 'NiceCrawler', category: 2 },

    // SEO Crawlers (category 3)
    { pattern: 'AhrefsBot', category: 3 },
    { pattern: 'AhrefsSiteAudit', category: 3 },
    { pattern: 'Barkrowler', category: 3 },
    { pattern: 'BLEXBot', category: 3 },
    { pattern: 'BrightEdge Crawler', category: 3 },
    { pattern: 'Cocolyzebot', category: 3 },
    { pattern: 'DataForSeoBot', category: 3 },
    { pattern: 'DomainStatsBot', category: 3 },
    { pattern: 'dotbot', category: 3 },
    { pattern: 'hypestat', category: 3 },
    { pattern: 'linkdexbot', category: 3 },
    { pattern: 'MJ12bot', category: 3 },
    { pattern: 'online-webceo-bot', category: 3 },
    { pattern: 'Screaming Frog SEO Spider', category: 3 },
    { pattern: 'SemrushBot', category: 3 },
    { pattern: 'SenutoBot', category: 3 },
    { pattern: 'SeobilityBot', category: 3 },
    { pattern: 'SEOkicks', category: 3 },
    { pattern: 'SEOlizer', category: 3 },
    { pattern: 'serpstatbot', category: 3 },
    { pattern: 'SiteCheckerBotCrawler', category: 3 },
    { pattern: 'SenutoBot', category: 3 },
    { pattern: 'ZoomBot', category: 3 },
    { pattern: 'Seodiver', category: 3 },
    { pattern: 'SEOlyzer', category: 3 },
    { pattern: 'Backlinkcrawler', category: 3 },
    { pattern: 'rogerbot', category: 3 },

    // Search Engines (category 4)
    { pattern: '360Spider', category: 4 },
    { pattern: 'AlexandriaOrgBot', category: 4 },
    { pattern: 'Baiduspider', category: 4 },
    { pattern: 'bingbot', category: 4 },
    { pattern: 'coccocbot-web', category: 4 },
    { pattern: 'Daum', category: 4 },
    { pattern: 'DuckDuckBot', category: 4 },
    { pattern: 'DuckDuckGo-Favicons-Bot', category: 4 },
    { pattern: 'Feedfetcher-Google', category: 4 },
    { pattern: 'Google Favicon', category: 4 },
    { pattern: 'Googlebot', category: 4 },
    { pattern: 'GoogleOther', category: 4 },
    { pattern: 'HaoSouSpider', category: 4 },
    { pattern: 'MojeekBot', category: 4 },
    { pattern: 'msnbot', category: 4 },
    { pattern: 'PetalBot', category: 4 },
    { pattern: 'Qwantbot', category: 4 },
    { pattern: 'Qwantify', category: 4 },
    { pattern: 'SemanticScholarBot', category: 4 },
    { pattern: 'SeznamBot', category: 4 },
    { pattern: 'Sogou web spider', category: 4 },
    { pattern: 'teoma', category: 4 },
    { pattern: 'TinEye', category: 4 },
    { pattern: 'yacybot', category: 4 },
    { pattern: 'Yahoo! Slurp', category: 4 },
    { pattern: 'Yandex', category: 4 },
    { pattern: 'Yeti', category: 4 },
    { pattern: 'YisouSpider', category: 4 },
    { pattern: 'ZumBot', category: 4 },
    { pattern: 'AntBot', category: 4 },

    // AI Search Crawlers (category 5)
    { pattern: 'Amazonbot', category: 5 },
    { pattern: 'Applebot', category: 5 },
    { pattern: 'OAI-SearchBot', category: 5 },
    { pattern: 'PerplexityBot', category: 5 },
    { pattern: 'YouBot', category: 5 },

    // AI Assistants (category 6)
    { pattern: 'ChatGPT-User', category: 6 },
    { pattern: 'DuckAssistBot', category: 6 },
    { pattern: 'Meta-ExternalFetcher', category: 6 },
    { pattern: 'Claude-Web', category: 6 },
    { pattern: 'cohere-ai', category: 6 },
    { pattern: 'GitHubCopilotChat', category: 6 },

    // Vulnerability scanners (category 7)
    { pattern: 'sqlmap', category: 7 },
    { pattern: 'WPScan', category: 7 },
    { pattern: 'feroxbuster', category: 7 },
    { pattern: 'masscan', category: 7 },
    { pattern: 'Fuzz Faster U Fool', category: 7 },
    { pattern: 'gobuster', category: 7 },
    { pattern: '(hydra)', category: 7 },
    { pattern: 'absinthe', category: 7 },
    { pattern: 'arachni', category: 7 },
    { pattern: 'bsqlbf', category: 7 },
    { pattern: 'cisco-torch', category: 7 },
    { pattern: 'crimscanner', category: 7 },
    { pattern: 'DirBuster', category: 7 },
    { pattern: 'Grendel-Scan', category: 7 },
    { pattern: 'Mysqloit', category: 7 },
    { pattern: 'Nmap NSE', category: 7 },
    { pattern: 'Nmap Scripting Engine', category: 7 },
    { pattern: 'Nessus', category: 7 },
    { pattern: 'Netsparker', category: 7 },
    { pattern: 'Nikto', category: 7 },
    { pattern: 'Paros', category: 7 },
    { pattern: 'uil2pn', category: 7 },
    { pattern: 'SQL Power Injector', category: 7 },
    { pattern: 'webshag', category: 7 },
    { pattern: 'Teh Forest Lobster', category: 7 },
    { pattern: 'DotDotPwn', category: 7 },
    { pattern: 'Havij', category: 7 },
    { pattern: 'OpenVAS', category: 7 },
    { pattern: 'ZmEu', category: 7 },
    { pattern: 'DominoHunter', category: 7 },
    { pattern: 'FHScan Core', category: 7 },
    { pattern: 'w3af', category: 7 },
    { pattern: 'cgichk', category: 7 },
    { pattern: 'webvulnscan', category: 7 },
    { pattern: 'sqlninja', category: 7 },
    { pattern: 'Argus-Scanner', category: 7 },
    { pattern: 'ShadowSpray.Kerb', category: 7 },
    { pattern: 'OWASP Amass', category: 7 },
    { pattern: 'Nuclei', category: 7 },

    // Headless browsers (category 8)
    { pattern: 'HeadlessChrome', category: 8 },
    { pattern: 'HeadlessEdg', category: 8 },

    // Social Media (category 9)
    { pattern: 'facebookexternalhit', category: 9 },
    { pattern: 'facebookcatalog', category: 9 },
    { pattern: 'meta-externalagent', category: 9 },
    { pattern: 'meta-externalfetcher', category: 9 },
    { pattern: 'Twitterbot', category: 9 },
    { pattern: 'Pinterestbot', category: 9 },
    { pattern: 'pinterest.com.bot', category: 9 },
    { pattern: 'LinkedInBot', category: 9 },
    { pattern: 'XING-contenttabreceiver', category: 9 },
    { pattern: 'redditbot', category: 9 }
  ];

  private getRandomIP(): string {
    // Common IP ranges for different regions
    const ipRanges = [
      // North America
      ['64.', '98.', '208.', '66.'],
      // Europe
      ['81.', '82.', '85.', '86.', '87.', '88.', '89.', '90.', '91.'],
      // Asia
      ['101.', '103.', '106.', '111.', '112.', '113.', '114.', '115.', '116.'],
      // South America
      ['177.', '179.', '181.', '186.', '187.', '189.', '190.', '191.'],
      // Africa
      ['41.', '102.', '105.', '154.', '196.', '197.'],
      // Australia/Oceania
      ['1.', '27.', '58.', '203.']
    ];

    // Pick a random region
    const region = ipRanges[Math.floor(Math.random() * ipRanges.length)];
    // Pick a random prefix from the region
    const prefix = region[Math.floor(Math.random() * region.length)];

    // Generate the rest of the IP address
    const segment2 = Math.floor(Math.random() * 256);
    const segment3 = Math.floor(Math.random() * 256);
    const segment4 = Math.floor(Math.random() * 256);

    return `${prefix}${segment2}.${segment3}.${segment4}`;
  }

  private generateRandomUserAgent(category?: number): string {
    let filteredAgents = this.USER_AGENTS;

    if (category) {
      filteredAgents = this.USER_AGENTS.filter(agent => agent.category === category);
    }

    const agent = filteredAgents[Math.floor(Math.random() * filteredAgents.length)];

    // Components for building more realistic user agents
    const platforms = [
      'Windows NT 10.0',
      'Macintosh; Intel Mac OS X 10_15_7',
      'X11; Linux x86_64',
      'iPhone; CPU iPhone OS 14_7_1 like Mac OS X',
      'Android 11; Mobile'
    ];

    const browsers = [
      'Chrome/91.0.4472.124',
      'Safari/537.36',
      'Firefox/89.0',
      'Edge/91.0.864.59'
    ];

    const versions = ['1.0', '2.0', '3.0', '4.0', '5.0', '6.0', '7.0'];
    const randomVersion = versions[Math.floor(Math.random() * versions.length)];
    const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)];
    const randomBrowser = browsers[Math.floor(Math.random() * browsers.length)];

    // Different formats based on category
    switch (agent.category) {
      case 4: // Search Engines
        return `Mozilla/5.0 (compatible; ${agent.pattern}/${randomVersion}; +http://example.com/bot)`;
      case 7: // Vulnerability scanners
        return `${agent.pattern}/${randomVersion} (Security Scan)`;
      case 8: // Headless browsers
        return `Mozilla/5.0 (${randomPlatform}) AppleWebKit/537.36 (KHTML, like Gecko) ${agent.pattern}/${randomVersion} ${randomBrowser}`;
      default:
        return `Mozilla/5.0 (compatible; ${agent.pattern}/${randomVersion}; +http://${agent.pattern.toLowerCase()}.com/bot)`;
    }
  }


  use(req: Request, res: Response, next: NextFunction) {
    // Set a random IP
    // We might need to tune this in the future to not have too many IP addresses
    // But at the same time our customers would, so ..
    req.headers['x-forwarded-for'] = this.getRandomIP();

    // 30% chance to add bot headers
    if (Math.random() < 0.3) {
      // Randomly select a category (1-9)
      const category = Math.floor(Math.random() * 9) + 1;

      // Generate user agent based on category
      const userAgent = this.generateRandomUserAgent(category);
      req.headers['user-agent'] = userAgent;

      // Add some randomization
      if (Math.random() < 0.5) {
        req.headers['accept-language'] = '*';
        req.headers['accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8';
      }

      // Add specific headers based on category
      switch (category) {
        case 1: // AI Data Scrapers
          req.headers['x-ai-type'] = 'data-scraper';
          break;
        case 3: // SEO Crawlers
          req.headers['x-crawl-depth'] = Math.floor(Math.random() * 5).toString();
          break;
        case 4: // Search Engines
          req.headers['x-crawl-rate'] = 'polite';
          break;
        case 7: // Vulnerability scanners
          req.headers['x-scan-type'] = 'security-audit';
          break;
        case 9: // Social Media
          req.headers['x-purpose'] = 'preview';
          break;
      }
    }

    next();
  }
}



