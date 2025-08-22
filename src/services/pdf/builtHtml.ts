import { RssFeed, YoutubeFeed } from '../../Interfaces';
import { formatDate } from '../../util/formatDate';
import { truncateText } from '../../util/truncateText';

type FeedsInput = {
  rss: RssFeed[];
  youtube: YoutubeFeed[];
};

export function buildHTML(data: FeedsInput) {
  const rssSection = (data.rss ?? [])
    .map(
      (feed) => `
      <div class="mb-8">
        <div class="flex items-center gap-4 text-[#0e141b] mb-6">
          ${
            feed.image
              ? `
            <div class="size-10 bg-center bg-no-repeat bg-cover rounded-full" style="background-image: url('${feed.image}')"></div>
          `
              : `
            <div class="size-10">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor"></path>
              </svg>
            </div>
          `
          }
          <div>
            <h2 class="text-[#0e141b] text-lg font-bold leading-tight tracking-[-0.015em]">${feed.name}</h2>
            <div class="text-[#4e7097] text-sm font-normal leading-normal">
              <a href="${feed.url}">${feed.url}</a>
              <span> • Última lectura: ${feed.lastRead}</span>
            </div>
          </div>
        </div>
        
        ${(feed.posts ?? [])
          .map(
            (p) => `
            <div class="">
              <div class="flex flex-col items-stretch justify-start rounded-lg xl:flex-row xl:items-start">
                <div class="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg xl:w-80 xl:flex-shrink-0" 
                     style="background-image: url('${p.image || 'https://via.placeholder.com/320x180/e7edf3/4e7097?text=No+Image'}')"></div>
                <div class="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 py-4 px-4">
                  <p class="text-[#0e141b] text-lg font-bold leading-tight tracking-[-0.015em]">
                    <a href="${p.link}" class="hover:text-[#4e7097]">${p.title}</a>
                  </p>
                  <div class="flex items-end gap-3 justify-between">
                    <div class="flex flex-col gap-1">
                      ${
                        p.content
                          ? `
                        <p class="text-[#4e7097] text-base font-normal leading-normal">
                          ${truncateText(p.content, 400)}
                        </p>
                      `
                          : ''
                      }
                      <p class="text-[#4e7097] text-base font-normal leading-normal">${formatDate(p.pubDate)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            `
          )
          .join('')}
      </div>`
    )
    .join('');

  const ytSection = (data.youtube ?? [])
    .map(
      (feed) => `
      <div class="mb-8">
        <div class="flex items-center gap-4 text-[#0e141b] mb-6">
          <div class="size-10 bg-red-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
            📺
          </div>
          <div>
            <h2 class="text-[#0e141b] text-lg font-bold leading-tight tracking-[-0.015em]">${feed.name}</h2>
            <div class="text-[#4e7097] text-sm font-normal leading-normal">
              <a href="${feed.url}">${feed.url}</a>
              <span> • Última lectura: ${feed.lastRead}</span>
            </div>
          </div>
        </div>
        
        ${(feed.videos ?? [])
          .map(
            (v) => `
            <div class="p-4">
              <div class="flex flex-col items-stretch justify-start rounded-lg xl:flex-row xl:items-start">
                <div class="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg xl:w-80 xl:flex-shrink-0 relative" 
                     style="background-image: url('${v.thumbnail || 'https://via.placeholder.com/320x180/e7edf3/4e7097?text=YouTube'}')">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="w-12 h-12 bg-black bg-opacity-70 rounded-full flex items-center justify-center text-white text-lg">
                      ▶
                    </div>
                  </div>
                </div>
                <div class="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 py-4 xl:px-4">
                  <p class="text-[#0e141b] text-lg font-bold leading-tight tracking-[-0.015em]">
                    <a href="${v.link}" class="hover:text-[#4e7097]">${v.title}</a>
                  </p>
                  <div class="flex items-end gap-3 justify-between">
                    <div class="flex flex-col gap-1">
                      ${
                        v.description
                          ? `
                        <p class="text-[#4e7097] text-base font-normal leading-normal">
                          ${v.description}
                        </p>
                      `
                          : ''
                      }
                      <p class="text-[#4e7097] text-base font-normal leading-normal">${formatDate(v.publishedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            `
          )
          .join('')}
      </div>`
    )
    .join('');

  return `
  <!doctype html>
  <html>
    <head>
      <link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin="" />
      <link
        rel="stylesheet"
        as="style"
        onload="this.rel='stylesheet'"
        href="https://fonts.googleapis.com/css2?display=swap&amp;family=Newsreader%3Awght%40400%3B500%3B700%3B800&amp;family=Noto+Sans%3Awght%40400%3B500%3B700%3B900"
      />
      <title>Resumen de Feeds</title>
      <link rel="icon" type="image/x-icon" href="data:image/x-icon;base64," />
      <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    </head>
    <body>
      <div class="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden" style='font-family: Newsreader, "Noto Sans", sans-serif;'>
        <div class="flex h-full flex-col">
          <header class="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e7edf3] py-3">
            <div class="flex items-center gap-8">
              <div class="flex items-center gap-4 text-[#0e141b]">
                <div class="size-4">
                  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor"></path>
                  </svg>
                </div>
                <h2 class="text-[#0e141b] text-lg font-bold leading-tight tracking-[-0.015em]">Newsletter Hub</h2>
              </div>
            </div>
          </header>
          
          <div class="flex flex-1 justify-center py-5">
            <div class="layout-content-container flex flex-col w-full flex-1">
            
              <!-- RSS Section -->
              <div class="">
                <h2 class="text-[#0e141b] text-xl font-bold leading-tight tracking-[-0.015em] mb-4">📑 RSS Articles</h2>
                ${rssSection || `<p class="text-[#4e7097] text-base font-normal leading-normal p-4">Sin entradas de RSS.</p>`}
              </div>
              
              <!-- YouTube Section -->
              <div class="">
                <h2 class="text-[#0e141b] text-xl font-bold leading-tight tracking-[-0.015em] mb-4">📺 YouTube Videos</h2>
                ${ytSection || `<p class="text-[#4e7097] text-base font-normal leading-normal p-4">Sin videos de YouTube.</p>`}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>
        @page { 
          size: A4; 
          margin: 15mm; 
        }
        
        @media print {
          .xl\\:w-80 { width: 200px !important; }
          .xl\\:flex-shrink-0 { flex-shrink: 0 !important; }
          .xl\\:flex-row { flex-direction: row !important; }
          .xl\\:items-start { align-items: flex-start !important; }
          .xl\\:px-4 { padding-left: 1rem !important; padding-right: 1rem !important; }
          .aspect-video { aspect-ratio: 16/9; }
          .size-4 { width: 1rem; height: 1rem; }
          .size-10 { width: 2.5rem; height: 2.5rem; }
          .min-w-72 { min-width: 18rem; }
        }
      </style>
    </body>
  </html>`;
}
