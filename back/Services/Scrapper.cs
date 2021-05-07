using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using AngleSharp.Html.Dom;
using AngleSharp.Html.Parser;
using back.Interfaces;

namespace back.Services
{
    public class Scrapper : IScrapper
    {
        private readonly HttpClient _client;
        private readonly IHtmlParser _parser;
        public Scrapper()
        {
            _parser = new HtmlParser();
            _client = new HttpClient();
        }

        public async Task<IHtmlDocument> GetPageAsync(string url)
        {
            using (HttpResponseMessage response = await _client.GetAsync(new Uri(url)))
            {
                if (response.IsSuccessStatusCode)
                {
                    var cancelationToken = new CancellationTokenSource().Token;
                    var stream = await response.Content.ReadAsStringAsync();
                    return await _parser.ParseDocumentAsync(stream, cancelationToken);
                }
                return null;
            }
        }
    }
}