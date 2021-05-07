using System.Collections.Generic;
using System.Threading.Tasks;
using back.Dtos;
using back.Models;

namespace back.Interfaces
{
    public interface IFavoriteSongService
    {
        Task<ResponseViewModel> AddSongToFavorites(FavoriteSongDto song, string userId);
        Task<IReadOnlyList<FavoriteSongDto>> GetFavoriteSongsForUser(string userId);
        Task<ResponseViewModel> RemoveSongFromFavorites(string nameIdentifier, string userId);
    }
}