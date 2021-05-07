using Microsoft.EntityFrameworkCore.Migrations;

namespace back.Migrations
{
    public partial class removedBuffer : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BufferURL",
                table: "FavoriteSongs");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BufferURL",
                table: "FavoriteSongs",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
