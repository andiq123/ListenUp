namespace back.Models
{
    public class FavoriteSong
    {
        public int Id { get; set; }
        public string IdentityUserId { get; set; }
        public string Title { get; set; }
        public string Name { get; set; }
        public string Duration { get; set; }
        public string DownloadUrl { get; set; }
        public string NameIdentifier { get; set; }
    }
}