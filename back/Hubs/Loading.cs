using System.Threading.Tasks;
using back.Models;
using Microsoft.AspNetCore.SignalR;

namespace back.Hubs
{
    public class Loading : Hub
    {
        public async Task onProgressChanged(int progress)
        {
            await Clients.All.SendAsync("ProgressChanged", progress);
        }

        public void onAddUserToQueue(int songId)
        {
            Presence.AddUser(new UserPresence { Id = Context.ConnectionId, SongId = songId });
        }

        public void onRemoveUserFromQueue(int songId)
        {
            Presence.RemoveUser(songId);
        }
    }
}