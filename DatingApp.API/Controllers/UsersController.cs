using AutoMapper;
using DatingApp.API.DTOs;
using DatingApp.API.Entities;
using DatingApp.API.Extensions;
using DatingApp.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DatingApp.API.Controllers
{
    [Authorize]
    public class UsersController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            var users = await userRepository.GetMembersAsync();
            return Ok(users);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<MemberDto>> GetUserById(int id)
        {
            var user = await userRepository.GetUserByIdAsync(id);
            if (user == null) return NotFound();

            return mapper.Map<MemberDto>(user);
        }

        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>> GetUserByname(string username)
        {
            var user = await userRepository.GetMemberByUsernameAsync(username);

            if (user == null) return NotFound();
            return user;
        }

        [HttpPut]
        public async Task<ActionResult> UpdateProfile(MemberUpdateDto memberUpdateDto)
        {
            var user = await userRepository.GetUserByUsernameAsync(User.GetUserName());
            if (user == null) return NotFound("user not found");

            mapper.Map(memberUpdateDto, user);
            if (await userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("failed to update user");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var user = await userRepository.GetUserByUsernameAsync(User.GetUserName());

            if (user == null) return BadRequest("cannot update user");

            var result = await photoService.AddPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);
            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            user.Photos.Add(photo);
            if (await userRepository.SaveAllAsync())
            {
                return CreatedAtAction(nameof(GetUserByname), new { username = user.UserName }, mapper.Map<PhotoDto>(photo));
            }

            return BadRequest("problem adding photo");
        }

        [HttpPut("set-main-photo/{photoid}")]
        public async Task<ActionResult> SetMainPhoto(int photoid)
        {
            var user = await userRepository.GetUserByUsernameAsync(User.GetUserName());

            if (user == null) return BadRequest("no user");

            var photo = user.Photos.FirstOrDefault(x => x.Id == photoid);
            if (photo == null || photo.IsMain) return BadRequest("cannot use this as main photo");

            var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);

            if (currentMain != null) currentMain.IsMain = false;

            photo.IsMain = true;

            if (await userRepository.SaveAllAsync())
            {
                return NoContent();
            }
            return BadRequest("failed");
        }

        [HttpDelete("delete-photo/{photoid}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await userRepository.GetUserByUsernameAsync(User.GetUserName());
            if (user == null) return BadRequest("user not found");
            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);
            if (photo == null || photo.IsMain) { return BadRequest("no valid operation"); }
            if(photo.PublicId != null)
            {
                var result = await photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null)
                {
                    return BadRequest(result.Error.Message);
                }
            }

            user.Photos.Remove(photo);
            if (await userRepository.SaveAllAsync())
            {
                return Ok();
            }

            return BadRequest("Not deleted");
        }
    }
}
