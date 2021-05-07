using System.Collections.Generic;

namespace back.Models
{
    public class Pagination
    {
        public Pagination(int pages, int currentPage)
        {
            this.Pages = pages;
            this.CurrentPage = currentPage;

        }
        public int Pages { get; set; } = 0;
        public int CurrentPage { get; set; } = 0;
    }
}