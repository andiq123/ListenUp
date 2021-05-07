using System.Security.Claims;
using System.Threading.Tasks;
using back.Dtos;
using back.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace back.Controllers
{
    [Authorize]
    public class FavSongsController : BaseController
    {
        private readonly IFavoriteSongService _favoriteSongService;
        public FavSongsController(IFavoriteSongService favoriteSongService)
        {
            _favoriteSongService = favoriteSongService;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddSongToFavorite([FromBody] FavoriteSongDto favoriteSongDto)
        {
            if (!ModelState.IsValid) return BadRequest("Some props are invalid");
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _favoriteSongService.AddSongToFavorites(favoriteSongDto, userId);
            if (result.IsSuccess) return Ok(result);
            return BadRequest(result);
        }

        [HttpGet("get")]
        public async Task<IActionResult> GetFavoriteSongs()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _favoriteSongService.GetFavoriteSongsForUser(userId);
            if (result.Count == 0) return NotFound("You do not have favorited songs!");
            return Ok(result);
        }

        [HttpPost("remove")]
        public async Task<IActionResult> RemoveSongFromFavorite([FromBody] RemoveSongDto song)
        {
            if (song == null) return BadRequest("Prop invalid");
            if (string.IsNullOrEmpty(song.NameIdentifier)) return BadRequest("Please type a name to delete");
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _favoriteSongService.RemoveSongFromFavorites(song.NameIdentifier, userId);
            if (result.IsSuccess) return Ok(result);
            return BadRequest(result);
        }

    }
}