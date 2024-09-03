using DatingApp.API.Data;
using DatingApp.API.DTOs;
using DatingApp.API.Entities;
using DatingApp.API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace DatingApp.API.Controllers
{
    public class AccountController(DataContext dataContext, ITokenService tokenService): BaseApiController
    {
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
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

            return new UserDto { Token = tokenService.CreateToken(user), UserName = user.UserName };
        }
        
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await dataContext.Users.FirstOrDefaultAsync(u => u.UserName == loginDto.Username.ToLower());
            if (user == null) return Unauthorized("Invalid username");
            using var hmac = new HMACSHA512(user.PasswordSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));
            for (int i=0; i<computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i]) { return Unauthorized("invalid password"); }
            }

            return new UserDto { Token = tokenService.CreateToken(user), UserName = user.UserName };
        }

        private async Task<bool> UserExist(string username)
        {
            return await dataContext.Users.AnyAsync(u => u.UserName.ToLower() == username.ToLower());
        }
    }
}
