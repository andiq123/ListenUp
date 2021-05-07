using Microsoft.EntityFrameworkCore.Migrations;

namespace back.Migrations
{
    public partial class bufferFixed : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "BufferUrl",
                table: "FavoriteSongs",
                newName: "BufferURL");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "BufferURL",
                table: "FavoriteSongs",
                newName: "BufferUrl");
        }
    }
}
