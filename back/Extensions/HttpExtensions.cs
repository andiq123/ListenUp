using System.Text.Json;
using back.Models;
using Microsoft.AspNetCore.Http;

namespace back.Extensions
{
    public static class HttpExtensions
    {
        public static void AddPaginationHeaders(this HttpResponse response, Pagination pagination)
        {
            response.Headers.Add("Pagination", JsonSerializer.Serialize(pagination));
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
    }
}