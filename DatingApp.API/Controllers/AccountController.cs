using DatingApp.API.Data;
using DatingApp.API.DTOs;
using DatingApp.API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace DatingApp.API.Controllers
{
    public class AccountController(DataContext dataContext): BaseApiController
    {
        [HttpPost("register")]
        public async Task<ActionResult<AppUser>> Register(RegisterDto registerDto)
        {
            if (await UserExist(registerDto.Username)) return BadRequest("username already exist");
            using var hmac = new HMACSHA512();

            var user = new AppUser() 
            { 
                UserName = registerDto.Username.ToLower(), 
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key
            };
            dataContext.Users.Add(user);
            await dataContext.SaveChangesAsync();

            return Ok(user);
        }

        private async Task<bool> UserExist(string username)
        {
            return await dataContext.Users.AnyAsync(u => u.UserName.ToLower() == username.ToLower());
        }
    }
}
