using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace back.Hubs.UsersOnSite
{
    public class UsersOnSite : Hub
    {
        public async override Task OnConnectedAsync()
        {
            PresenceOnSite.AddUser(this.Context.ConnectionId);
            await Clients.All.SendAsync("PresenceChange", PresenceOnSite.GetPresencesCount());
            await base.OnConnectedAsync();
        }

        public async override Task OnDisconnectedAsync(Exception exception)
        {
            PresenceOnSite.RemoveUser(this.Context.ConnectionId);
            await Clients.All.SendAsync("PresenceChange", PresenceOnSite.GetPresencesCount());
            await base.OnDisconnectedAsync(exception);
        }
    }
}