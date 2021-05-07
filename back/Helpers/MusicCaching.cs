using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace back.Helpers
{
    public class MusicCaching
    {
        private readonly string _folderPath = Path.Combine(Directory.GetCurrentDirectory(), "Cache");
        public MusicCaching()
        {
            CheckIfCacheFolderExists();
        }

        public async Task<byte[]> GetFileIfExists(string name)
        {
            var filePath = Path.Combine(_folderPath, name);
            if (File.Exists(filePath))
                return await File.ReadAllBytesAsync(filePath);
            else
                return null;
        }

        private void CheckIfCacheFolderExists()
        {
            if (!Directory.Exists(_folderPath))
                Directory.CreateDirectory(_folderPath);
        }

        public string GetChachePath() => _folderPath;

    }
}