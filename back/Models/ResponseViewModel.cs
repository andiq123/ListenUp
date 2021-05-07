using System.Collections.Generic;

namespace back.Models
{
    public class ResponseViewModel
    {
        public string UserName { get; set; }
        public string Message { get; set; }
        public bool IsSuccess { get; set; }
        public IEnumerable<string> Errors { get; set; }
    }
}