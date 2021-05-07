using Microsoft.EntityFrameworkCore.Migrations;

namespace back.Migrations
{
    public partial class buffer : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BufferUrl",
                table: "FavoriteSongs",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BufferUrl",
                table: "FavoriteSongs");
        }
    }
}
