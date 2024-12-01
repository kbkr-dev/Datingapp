
using DatingApp.API.Data;
using DatingApp.API.Entities;
using DatingApp.API.Extensions;
using DatingApp.API.Interfaces;
using DatingApp.API.Middleware;
using DatingApp.API.Services;
using DatingApp.API.SignalR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace DatingApp.API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddApplicationServices(builder.Configuration);
            builder.Services.AddIdentityServices(builder.Configuration);
            var app = builder.Build();

            // Configure the HTTP request pipeline.
            app.UseMiddleware<ExceptionMiddleware>();
            app.UseCors(x => x.AllowAnyHeader()
            .AllowAnyMethod().AllowCredentials()
            .WithOrigins("http://localhost:4200", "https://localhost:4200"));
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.MapControllers();
            app.MapHub<PresenceHub>("hubs/presence");
            app.MapHub<MessageHub>("hubs/message");
            app.MapFallbackToController("Index", "Fallback");

            using var scope = app.Services.CreateScope();
            var services = scope.ServiceProvider;
            try
            {
                var context = services.GetRequiredService<DataContext>();
                var userManager = services.GetRequiredService<UserManager<AppUser>>();
                var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
                await context.Database.MigrateAsync();
                await context.Database.ExecuteSqlRawAsync("DELETE FROM [CONNECTIONS]");
                await Seed.SeedUsers(userManager, roleManager);
            }
            catch (Exception ex)
            {
                var logger = services.GetRequiredService<ILogger<Program>>();
                logger.LogError(ex, "Error occured during migration");
                throw;
            }

            app.Run();
        }
    }
}
