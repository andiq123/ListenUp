namespace back.Extensions
{
    public static class StringExtensions
    {
        public static string EnsureFileHasMp3Extension(this string name)
        {
            if (!name.Contains(".mp3"))
                name = name + ".mp3";
            return name;
        }

        public static string ExludeBadSigns(this string name)
        {
            var newName = "";
            foreach (char letter in name)
            {
                if (char.IsLetter(letter) || char.IsLower(letter) || char.IsWhiteSpace(letter) || char.IsNumber(letter) || letter == '-')
                {
                    newName += letter;
                }
            }
            return newName.Trim();
        }
    }
}