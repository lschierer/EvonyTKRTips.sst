package TestsFor::Game::EvonyTKR::General;
use 5.40.0;

use Test::Most; 
use Test::File::ShareDir::Object::Dist;

use Game::EvonyTKR::General;

my $g = Game::EvonyTKR::General->new(
  name                  => 'Test General',
  leadership            => 1.0,
  leadership_increment  => 0.1,
  attack                => 1.0,
  attack_increment      => 0.1,
  defense               => 1.0,
  defense_increment     => 0.1,
  politics              => 1.0,
  politics_increment    => 0.1,
);
isa_ok($g, 'Game::EvonyTKR::General');



done_testing();
