use 5.40.0;
use strict;
use warnings;
use Module::Build;
Module::Build->VERSION('0.4004');

my $builder = Module::Build->new(
    module_name         => 'Game::Evony::General',
    license             => 'CC_BY_NC_4_0',
    dist_author         => q{ Luke Schierer <luke@schierer.org>},
    dist_version_from   => 'lib/Game/Evony/General.pm',
    release_status      => 'unstable',
    configure_requires => {
        'Module::Build' => '0.4004',
    },
    test_requires => {
        'Test::More' => '0',
    },
    requires => {
      'Data::ULID'        => '1.3',
      'JSON'              => '4.10',
      'Cpanel::JSON::XS'  => '4.38',
      'JSON::MaybeXS'     => '1.004005',
      'Moo'               => '2.005005',
      'Type::Tiny'        => '2.004000',
      'namespace::clean'  => '0.27',
    },
    add_to_cleanup     => [ 'Game::Evony-*' ],
);

$builder->create_build_script();
