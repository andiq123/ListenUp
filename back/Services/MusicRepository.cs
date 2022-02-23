using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using back.Dtos;
using back.Extensions;
using back.Interfaces;
using back.Models;
using Microsoft.Extensions.Configuration;

namespace back.Services
{
    public class MusicRepository : IMusicRepository
    {
        private readonly IScrapper _scrapper;
        private readonly IConfiguration _config;
        public MusicRepository(IScrapper scrapper, IConfiguration config)
        {
            _config = config;
            _scrapper = scrapper;
        }

        public async Task<PaginatedResponse<Song>> GetSongsByName(SearchParams searchParams)
        {
            var url = _config.GetValue<string>("HotPleerBaseUrlWithSearch") + searchParams.Name + "&p=" + searchParams.Page;
            var page = await _scrapper.GetPageAsync(url);
            if (page == null) return null;
            List<Song> songs = new();
            Pagination pagination = new(0, 0);
            try
            {
                var totalPages = page.QuerySelectorAll("#pagination a").Length;
                var currentPage = page.QuerySelector("#pagination b").InnerHtml;
                pagination = new(totalPages, Int32.Parse(currentPage));
            }
            catch
            {

            }

            var songElements = page.QuerySelectorAll("div.i");
            if (songElements.Length == 0) return null;
            int previousRandomNr = 0;
            foreach (var songElement in songElements)
            {
                try
                {
                    var random = new Random().Next(0, 500);
                    while (random == previousRandomNr)
                    {
                        random = new Random().Next(0, 500);
                    }
                    var title = songElement.QuerySelector("span.tt").InnerHtml.ExludeBadSigns();
                    var name = songElement.QuerySelector(".title a").InnerHtml.ExludeBadSigns();
                    var duration = songElement.QuerySelector(".dur").InnerHtml.ExludeBadSigns();
                    var downloadUrl = songElement.QuerySelector("a.dwnld.fa.fa-download").GetAttribute("href") + "?play";
                    songs.Add(new Song { Id = random, Title = title, Name = name, Duration = duration, DownloadUrl = downloadUrl });
                    previousRandomNr = random;
                }
                catch
                {
                    continue;
                }
            }
            return new PaginatedResponse<Song> { Items = songs.AsReadOnly(), Pagination = pagination };
        }
    }
}