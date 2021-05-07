using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using back.Dtos;
using back.Interfaces;
using back.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace back.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IConfiguration _config;
        public AuthService(UserManager<IdentityUser> userManager, IConfiguration config)
        {
            _config = config;
            _userManager = userManager;
        }
        public async Task<ResponseViewModel> RegisterAsync(RegisterViewModel model)
        {
            if (model.Password != model.ConfirmPassword) return new ResponseViewModel { Message = "Passwords do not match!", IsSuccess = false };
            var identityUser = new IdentityUser()
            {
                UserName = model.Username,
            };
            var result = await _userManager.CreateAsync(identityUser, model.Password);
            if (result.Succeeded) return new ResponseViewModel { Message = "User Created successfully!", IsSuccess = true };
            return new ResponseViewModel { Message = "User not created, there was a problem...", IsSuccess = false, Errors = result.Errors.Select(x => x.Description) };
        }

        public async Task<ResponseViewModel> LoginAsync(LoginViewModel model)
        {
            var user = await _userManager.FindByNameAsync(model.UserName);
            if (user == null) return new ResponseViewModel { Message = "No user was found", IsSuccess = false };

            var result = await _userManager.CheckPasswordAsync(user, model.Password);
            if (!result) return new ResponseViewModel { Message = "Password is incorrect", IsSuccess = false };

            var claims = new[]{
                new Claim(ClaimTypes.Name,user.UserName),
                new Claim(ClaimTypes.NameIdentifier,user.Id)
            };

            var keyBuffer = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["AuthSettings:Key"]));

            var token = new JwtSecurityToken(
                issuer: _config["AuthSettings:Issuer"],
                audience: _config["AuthSettings:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMonths(1),
                signingCredentials: new SigningCredentials(keyBuffer, SecurityAlgorithms.HmacSha512)
            );

            var tokenToString = new JwtSecurityTokenHandler().WriteToken(token);
            return new ResponseViewModel { Message = tokenToString, IsSuccess = true, UserName = user.UserName };
        }
    }
}