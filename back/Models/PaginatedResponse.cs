using System.Collections.Generic;

namespace back.Models
{
    public class PaginatedResponse<T>
    {
        public Pagination Pagination { get; set; }
        public IReadOnlyList<T> Items { get; set; }
    }
}