using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.Entities
{
    public class Connection
    {
        [Key]
        public required string ConnectionId { get; set; }
        public required string Username { get; set; }
    }
}
