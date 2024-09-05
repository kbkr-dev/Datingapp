using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.DTOs;
using DatingApp.API.Entities;
using DatingApp.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Controllers
{
    //[Authorize]
    public class UsersController(IUserRepository userRepository, IMapper mapper) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            var users = await userRepository.GetMembersAsync();
            //var finalUsers = mapper.Map<IEnumerable<MemberDto>>(users);
            return Ok(users);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<MemberDto>> GetUserById(int id)
        {
            var user = await userRepository.GetUserByIdAsync(id);
            if (user == null) return NotFound();

            return mapper.Map<MemberDto>(user);
        }

        [HttpGet("username")]
        public async Task<ActionResult<MemberDto>> GetUserByname(string username)
        {
            var user = await userRepository.GetMemberByUsernameAsync(username);

            if (user == null) return NotFound();
            return user;
        }
    }
}
