using Microsoft.EntityFrameworkCore.Migrations;

namespace back.Migrations
{
    public partial class addedFavSongs : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "IdentityUserId",
                table: "FavoriteSongs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NameIdentifier",
                table: "FavoriteSongs",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IdentityUserId",
                table: "FavoriteSongs");

            migrationBuilder.DropColumn(
                name: "NameIdentifier",
                table: "FavoriteSongs");
        }
    }
}
