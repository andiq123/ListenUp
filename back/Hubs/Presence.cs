using System;
using System.Collections.Generic;
using back.Models;

namespace back.Hubs
{
    public static class Presence
    {
        private static List<UserPresence> UsersInQueue { get; set; } = new List<UserPresence>();

        public static void AddUser(UserPresence user)
        {
            if (!UsersInQueue.Contains(user))
                UsersInQueue.Add(user);
        }

        public static void RemoveUser(int songId)
        {
            var user = UsersInQueue.Find(x => x.SongId == songId);
            var removed = user != null && UsersInQueue.Remove(user);
            if (!removed)
                Console.WriteLine($"problems removing {songId}");
        }

        public static UserPresence GetUserBySongName(int songID)
        {
            return UsersInQueue.Find(x => x.SongId == songID);
        }
    }
}