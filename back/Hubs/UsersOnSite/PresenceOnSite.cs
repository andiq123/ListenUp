using System;
using System.Collections.Generic;

namespace back.Hubs.UsersOnSite
{
    public class PresenceOnSite
    {
        private static List<string> Presences { get; set; } = new List<string>();

        public static void AddUser(string presence)
        {
            if (!Presences.Contains(presence))
                Presences.Add(presence);
        }

        public static void RemoveUser(string presence)
        {
            if (Presences.Contains(presence))
            {
                Presences.Remove(presence);
            }
        }

        public static int GetPresencesCount()
        {
            return Presences.Count;
        }
    }
}