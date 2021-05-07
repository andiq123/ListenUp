using System.Threading.Tasks;
using back.Dtos;
using back.Models;

namespace back.Interfaces
{
    public interface IAuthService
    {
        Task<ResponseViewModel> RegisterAsync(RegisterViewModel model);
        Task<ResponseViewModel> LoginAsync(LoginViewModel model);
    }
}