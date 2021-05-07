using System.Collections.Generic;
using System.Threading.Tasks;
using back.Dtos;
using back.Models;

namespace back.Interfaces
{
    public interface IMusicRepository
    {
        Task<PaginatedResponse<Song>> GetSongsByName(SearchParams searchParams);
    }
}