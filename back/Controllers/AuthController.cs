using System.Threading.Tasks;
using back.Dtos;
using back.Interfaces;
using back.Models;
using Microsoft.AspNetCore.Mvc;

namespace back.Controllers
{
    public class AuthController : BaseController
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync(RegisterViewModel model)
        {
            if (!ModelState.IsValid) return BadRequest("Some props are invalid");
            var result = await _authService.RegisterAsync(model);
            if (result.IsSuccess) return Ok(result);
            return BadRequest(result);
        }


        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync(LoginViewModel model)
        {
            if (!ModelState.IsValid) return BadRequest("Some props are invalid");
            var result = await _authService.LoginAsync(model);
            if (!result.IsSuccess) return BadRequest(result);
            else return Ok(result);
        }
    }
}