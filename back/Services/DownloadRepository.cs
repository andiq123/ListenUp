using System;
using System.IO;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using back.Dtos;
using back.Extensions;
using back.Helpers;
using back.Hubs;
using back.Interfaces;
using back.Models;
using Microsoft.AspNetCore.SignalR;

namespace back.Services
{
    public class DownloadRepository : IDownloadRepository
    {
        private readonly WebClient _client;
        private readonly MusicCaching _musicCache;
        private readonly IHubContext<Loading> _hubContext;
        private UserPresence user;
        private double? doublePercentage = null;

        public DownloadRepository(IHubContext<Loading> hubContext)
        {
            _hubContext = hubContext;
            _client = new WebClient();
            _musicCache = new MusicCaching();
        }

        private async void emitProgressChangedToClient(object sender, DownloadProgressChangedEventArgs e)
        {
            if (doublePercentage != e.ProgressPercentage)
            {
                doublePercentage = e.ProgressPercentage;
                await _hubContext.Clients.Client(user.Id).SendAsync("ProgressChanged", new SongProgress { SongId = user.SongId, ProgressPercentage = e.ProgressPercentage });
            }
        }

        public async Task<byte[]> GetFileBytesAsync(SongDto song)
        {
            var fileFromCache = await _musicCache.GetFileIfExists(song.SongName);
            if (fileFromCache != null) return fileFromCache;

            user = Presence.GetUserBySongName(song.SongId);
            if (user != null)
            {
                _client.DownloadProgressChanged += emitProgressChangedToClient;
            }

            var path = Path.Combine(_musicCache.GetChachePath(), song.SongName);
            await _client.DownloadFileTaskAsync(song.Link, path);

            fileFromCache = await _musicCache.GetFileIfExists(song.SongName);
            if (fileFromCache == null || fileFromCache.Length == 0) return null;
            return fileFromCache;
        }
    }
}