using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using back.Data;
using back.Dtos;
using back.Interfaces;
using back.Models;
using Microsoft.EntityFrameworkCore;

namespace back.Services
{
    public class FavoriteSongService : IFavoriteSongService
    {
        private readonly DataContext _context;
        public FavoriteSongService(DataContext context)
        {
            _context = context;
        }

        public async Task<ResponseViewModel> AddSongToFavorites(FavoriteSongDto song, string userId)
        {
            var nameIdentifier = song.Title + song.Name;
            var songExists = await getSongFromLibrary(nameIdentifier, userId);
            if (songExists != null) return new ResponseViewModel { Message = "This song is already in your library", IsSuccess = false };

            var FavSong = new FavoriteSong
            {
                IdentityUserId = userId,
                Name = song.Name,
                Title = song.Title,
                Duration = song.Duration,
                DownloadUrl = song.DownloadUrl,
                NameIdentifier = nameIdentifier
            };
            await _context.FavoriteSongs.AddAsync(FavSong);
            await _context.SaveChangesAsync();

            return new ResponseViewModel { Message = "Song added successfully", IsSuccess = true };
        }

        public async Task<ResponseViewModel> RemoveSongFromFavorites(string nameIdentifier, string userId)
        {
            var songExists = await getSongFromLibrary(nameIdentifier, userId);
            if (songExists == null) return new ResponseViewModel { Message = "Song doesnt exists in your library", IsSuccess = false };

            _context.FavoriteSongs.Remove(songExists);
            await _context.SaveChangesAsync();
            return new ResponseViewModel { Message = "Song deleted successfully", IsSuccess = true };
        }

        private async Task<FavoriteSong> getSongFromLibrary(string nameIdentifier, string userId)
        {
            return await _context.FavoriteSongs.FirstOrDefaultAsync(x => x.NameIdentifier == nameIdentifier && x.IdentityUserId == userId);
        }

        public async Task<IReadOnlyList<FavoriteSongDto>> GetFavoriteSongsForUser(string userId)
        {
            var songs = await _context.FavoriteSongs.Where(x => x.IdentityUserId == userId)
            .Select(x => new FavoriteSongDto { Id = x.Id, Title = x.Title, Name = x.Name, DownloadUrl = x.DownloadUrl, Duration = x.Duration })
            .ToListAsync();
            return songs;
        }


    }
}