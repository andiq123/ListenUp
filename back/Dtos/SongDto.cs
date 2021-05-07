using System.ComponentModel.DataAnnotations;

namespace back.Dtos
{
    public class SongDto
    {
        [Required]
        public string SongName { get; set; }

        [Required]
        public string Link { get; set; }

        public int SongId { get; set; }
    }
}