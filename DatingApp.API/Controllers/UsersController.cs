using DatingApp.API.Data;
using DatingApp.API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Controllers
{
    public class UsersController(DataContext dataContext) : BaseApiController
    {
        private readonly DataContext _dataContext = dataContext;

        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
        {
            var users = await _dataContext.Users.ToListAsync();

            return Ok(users);
        }

        [Authorize]
        [HttpGet("{id:int}")]
        public async Task<ActionResult<AppUser>> GetUserById(int id)
        {
            var user = await _dataContext.Users.FindAsync(id);

            if (user == null) return NotFound();

            return user;
        }
    }
}
