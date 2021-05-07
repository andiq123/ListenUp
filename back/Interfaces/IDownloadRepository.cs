using System.Threading.Tasks;
using back.Dtos;

namespace back.Interfaces
{
    public interface IDownloadRepository
    {
        Task<byte[]> GetFileBytesAsync(SongDto song);
    }
}