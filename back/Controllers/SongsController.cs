using System.Threading.Tasks;
using back.Dtos;
using back.Extensions;
using back.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace back.Controllers
{
    public class SongsController : BaseController
    {
        private readonly IMusicRepository _musicRepo;
        private readonly IDownloadRepository _downloadRepo;
        public SongsController(IMusicRepository musicRepo, IDownloadRepository downloadRepo)
        {
            _downloadRepo = downloadRepo;
            _musicRepo = musicRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetSongsByName([FromQuery] SearchParams searchParams)
        {
            if (string.IsNullOrEmpty(searchParams.Name)) return BadRequest("Please type a name!");
            searchParams.Name = searchParams.Name.ExludeBadSigns();

            var paginatedResponse = await _musicRepo.GetSongsByName(searchParams);
            if (paginatedResponse == null || paginatedResponse.Items == null) return NotFound("Sorry but there were no song found for this criteria...");

            HttpContext.Response.AddPaginationHeaders(paginatedResponse.Pagination);
            return Ok(paginatedResponse.Items);
        }

        [HttpPost("download")]
        public async Task<IActionResult> DownloadSongByLink([FromBody] SongDto song)
        {
            if (song == null) return BadRequest("Please give me data!");
            song.SongName = song.SongName.ExludeBadSigns();
            song.SongName = song.SongName.EnsureFileHasMp3Extension();


            var file = await _downloadRepo.GetFileBytesAsync(song);
            if (file == null) return StatusCode(500);
            return File(file, "audio/mpeg", song.SongName);
        }
    }
}