using System.Threading.Tasks;
using AngleSharp.Html.Dom;

namespace back.Interfaces
{
    public interface IScrapper
    {
        Task<IHtmlDocument> GetPageAsync(string url);
    }
}